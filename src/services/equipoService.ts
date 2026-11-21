
import { supabase } from '../config/supabase';

// Obtener todos los equipos
export const obtenerEquipos = async () => {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Obtener un equipo por su ID
export const obtenerEquipoPorId = async (id: string) => {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Eliminar un equipo
export const eliminarEquipo = async (id: string) => {
  const { error } = await supabase
    .from('equipos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
