
import { supabase } from '../config/supabase';

// Obtener sesión actual
export const obtenerSesion = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
};

// Iniciar sesión
export const iniciarSesion = async (
  correo: string,
  password: string
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};

// Cerrar sesión
export const cerrarSesion = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

// Obtener perfil del usuario
export const obtenerPerfil = async (usuarioId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', usuarioId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
