
import { supabase } from '../config/supabase';

// Consultar todos los préstamos
export const obtenerPrestamos = async () => {
  const { data, error } = await supabase
    .from('prestamos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Consultar préstamos de un estudiante
export const obtenerPrestamosEstudiante = async (
  estudianteId: string
) => {
  const { data, error } = await supabase
    .from('prestamos')
    .select('*')
    .eq('estudiante_id', estudianteId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Actualizar el estado de un préstamo
export const actualizarEstadoPrestamo = async (
  prestamoId: string,
  nuevoEstado: string
) => {
  const { data, error } = await supabase
    .from('prestamos')
    .update({ estado: nuevoEstado })
    .eq('id', prestamoId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
