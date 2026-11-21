
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export interface Equipo {
  id: string;
  nombre: string;
  descripcion?: string;
  disponibilidad: boolean;
}

interface Props {
  equipo: Equipo;
  onSolicitar: (equipo: Equipo) => void;
}

export default function EquipmentCard({
  equipo,
  onSolicitar,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>{equipo.nombre}</Text>

      <Text style={styles.descripcion}>
        {equipo.descripcion || 'Sin descripción'}
      </Text>

      <Text style={{
        color: equipo.disponibilidad ? 'green' : 'red',
        fontWeight: 'bold',
      }}>
        {equipo.disponibilidad ? 'Disponible' : 'No disponible'}
      </Text>

      <TouchableOpacity
        style={styles.boton}
        disabled={!equipo.disponibilidad}
        onPress={() => onSolicitar(equipo)}
      >
        <Text style={styles.textoBoton}>
          Solicitar préstamo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    marginVertical: 8,
    color: '#64748b',
  },
  boton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

