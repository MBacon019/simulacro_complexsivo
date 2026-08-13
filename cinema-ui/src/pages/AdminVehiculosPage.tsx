import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi } from "../api/marca.api";
import { type Reservations, listReservationssAdminApi, createReservationsApi, updateReservationsApi, deleteReservationsApi, type Reservations } from "../api/vehiculos.api";

export default function AdminVehiculosPage() {
  const [items, setItems] = useState<Reservations[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState(2020);
  const [placa, setPlaca] = useState("");
  const [color, setColor] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationssAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar reservaciones. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una show");
      if (!modelo.trim() || !placa.trim()) return setError("Modelo y placa son requeridos");

      const payload = {
        show: Number(show),
        modelo: modelo.trim(),
        anio: Number(anio),
        placa: placa.trim(),
        color: color.trim(),
      };

      if (editId) await updateReservationsApi(editId, payload);
      else await createReservationsApi(payload as any);

      setEditId(null);
      setModelo("");
      setPlaca("");
      setColor("");
      await load();
    } catch {
      setError("No se pudo guardar reservación. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservations) => {
    setEditId(v.id);
    setShow(v.show);
    setModelo(v.modelo);
    setAnio(v.anio);
    setPlaca(v.placa);
    setColor(v.color || "");
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationsApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar reservación. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Reservaciones (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">Show</InputLabel>
              <Select
                labelId="show-label"
                label="Show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nombre} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setModelo(""); setPlaca(""); setColor(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Show</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.show_nombre ?? v.show}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.anio}</TableCell>
                <TableCell>{v.placa}</TableCell>
                <TableCell>{v.color || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}