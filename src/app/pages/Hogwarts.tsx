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
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { globals } from '../global/global';
import Image from 'next/image';
import './../global.css';

type Aspirant = {
  id: string;
  name: string;
  species: string;
  house: string;
  patronus: string;
  image: string;
};

const DefaultImage = '/pngegg.png';

export default function Hogwarts() {
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterHouse, setFilterHouse] = useState<string | null>(null);
  const [filterName, setFilterName] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(globals.API_URL);

      setAspirants(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearList = () => {
    setAspirants([]);
  };

  const handleShowCompleteList = () => {
    fetchData();
  };

  const handleFilterHouse = (house: string) => {
    setFilterHouse(house);
  };

  const handleFilterName = (name: string) => {
    setFilterName(name);
  };

  const handleHideAspirant = (id: string) => {
    setAspirants((prevAspirants) =>
      prevAspirants.filter((aspirant) => aspirant.id !== id)
    );
  };

  const filteredAspirants = aspirants.filter(
    (aspirant) =>
      (!filterHouse || aspirant.house === filterHouse) &&
      (!filterName ||
        aspirant.name.toLowerCase().includes(filterName.toLowerCase()))
  );

  return (
    <div className="Hogwarts-table" style={{padding: '2rem'}}>
      <h1>Aspirantes a Hogwarts</h1>
      <div className="toolbar">
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
        <input
          type="text"
          value={filterName}
          onChange={(e) => handleFilterName(e.target.value)}
          placeholder="Filtrar por nombre"
        />
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
            {loading ? (
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
