'use client';

import { useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { globals } from '../global/global';
import Image from 'next/image';
import { Aspirant } from './../models/Aspirant';
import { Status } from '../global/enums';

const DefaultImage = '/pngegg.png';

export default function Hogwarts() {
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterHouse, setFilterHouse] = useState<string | null>(null);
  const [filterName, setFilterName] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.empty);

  const fetchData = async () => {
    setStatus(Status.charging);

    try {
      const response = await axios.get(globals.API_URL);

      setAspirants(response.data);
      setStatus(Status.done);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus(Status.empty);
    }
  };

  const handleClearList = () => {
    setAspirants([]);

    setStatus(Status.empty);
  };

  const handleShowCompleteList = () => {
    fetchData();
  };

  const handleFilterHouse = (house: string) => {
    const normalized = house.toLowerCase().trim();

    setFilterHouse(normalized);
  };

  const handleFilterName = (name: string) => {
        const normalized = name.toLowerCase().trim();

    setFilterName(normalized);
  };

  const handleHideAspirant = (id: string) => {
    setAspirants((prevAspirants) =>
      prevAspirants.filter((aspirant) => aspirant.id !== id)
    );
  };

  const filteredAspirants = aspirants.filter(
    (aspirant) =>
      (!filterHouse ||
        aspirant.house.toLowerCase().includes(filterHouse.toLowerCase())) &&
      (!filterName ||
        aspirant.name.toLowerCase().includes(filterName.toLowerCase()))
  );

  return (
    <div className="Hogwarts-table" style={{ padding: '2rem' }}>
      <h1>Aspirantes a Hogwarts</h1>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexDirection: 'column',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
        >
          <Button variant="contained" color="primary" onClick={handleClearList}>
            Limpiar lista
          </Button>{' '}
          <Button
            variant="contained"
            color="primary"
            onClick={handleShowCompleteList}
          >
            Mostrar lista completa
          </Button>{' '}
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
        >
          <TextField
            label="Filtrar por nombre"
            variant="standard"
            onChange={(e) => handleFilterName(e.target.value)}
          />

          <TextField
            label="Filtrar por casa"
            variant="standard"
            onChange={(e) => handleFilterHouse(e.target.value)}
          />
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fotografía</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Especie</TableCell>
              <TableCell>Casa</TableCell>
              <TableCell>Patronus</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status == Status.charging ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : filteredAspirants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  No hay información por mostrar...
                </TableCell>
              </TableRow>
            ) : (
              filteredAspirants.map((aspirant) => (
                <TableRow key={aspirant.id}>
                  <TableCell>
                    <Image
                      src={aspirant.image || DefaultImage}
                      alt={aspirant.name}
                      width="50"
                      height="50"
                    />
                  </TableCell>
                  <TableCell>{aspirant.name}</TableCell>
                  <TableCell>{aspirant.species}</TableCell>
                  <TableCell>{aspirant.house}</TableCell>
                  <TableCell>{aspirant.patronus}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleHideAspirant(aspirant.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Ocultar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
