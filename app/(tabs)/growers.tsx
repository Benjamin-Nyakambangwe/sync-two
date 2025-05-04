import { ProductionCycleRegistrationRecord } from '@/powersync/Schema';
import { powersync, setupPowerSync } from '@/powersync/system';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Combined type for joined data
type JoinedGrowerData = ProductionCycleRegistrationRecord & {
  grower_number?: string;
//   grower_cellphone?: string;
//   grower_email?: string;
//   grower_farm_name?: string;
//   grower_province?: string;
};

const GrowersScreen = () => {
  const [growers, setGrowers] = useState<JoinedGrowerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize PowerSync if not already initialized
    setupPowerSync();
    
    // Set up a watch query to get and monitor growers data
    const controller = new AbortController();
    
    console.log('Setting up growers data watcher with JOIN...');
    
    powersync.watch(
      `SELECT 
        r.id, 
        r.grower_name, 
        r.mobile, 
        r.production_scheme_id, 
        r.production_cycle_name,
        r.grower_id as registration_grower_id,
        g.id as grower_table_id,
        g.grower_number as grower_number
      FROM odoo_gms_production_cycle_registration r
      LEFT JOIN odoo_gms_grower g ON CAST(r.grower_id AS TEXT) = g.id
      ORDER BY r.grower_name`,
      [],
      {
        onResult: (result) => {
          console.log('Joined growers data updated, count:', result.rows?._array?.length);
          if (result.rows?._array) {
            // Log the first few records to debug
            if (result.rows._array.length > 0) {
              console.log('Sample record:', JSON.stringify(result.rows._array[0]));
              console.log('Join fields:', result.rows._array.slice(0, 3).map(row => ({
                registration_grower_id: row.registration_grower_id,
                grower_table_id: row.grower_table_id
              })));
            }
            setGrowers(result.rows._array as JoinedGrowerData[]);
          }
          setLoading(false);
        },
        onError: (err) => {
          console.error('Error fetching growers:', err);
          setError(err.message);
          setLoading(false);
        }
      },
      { signal: controller.signal }
    );
    
    return () => {
      controller.abort();
    };
  }, []);

  const renderGrowerItem = ({ item }: { item: JoinedGrowerData }) => (
    <TouchableOpacity style={styles.growerCard}>
      <Text style={styles.growerName}>{item.grower_name}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Registration Info:</Text>
          <Text style={styles.infoText}>ID: {item.id}</Text>
          <Text style={styles.infoText}>Mobile: {item.mobile || 'N/A'}</Text>
          <Text style={styles.infoText}>Scheme: {item.production_scheme_id || 'N/A'}</Text>
          <Text style={styles.infoText}>Cycle: {item.production_cycle_name || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Grower Details:</Text>
          <Text style={styles.infoText}>Number: {item.grower_number || 'N/A'}</Text>
          {/* <Text style={styles.infoText}>Phone: {item.grower_cellphone || 'N/A'}</Text>
          <Text style={styles.infoText}>Email: {item.grower_email || 'N/A'}</Text>
          <Text style={styles.infoText}>Farm: {item.grower_farm_name || 'N/A'}</Text>
          <Text style={styles.infoText}>Province: {item.grower_province || 'N/A'}</Text> */}
          <Text style={styles.infoText}>Grower ID: {item.grower_number || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading growers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Growers ({growers.length})</Text>
      
      {growers.length === 0 ? (
        <Text style={styles.noData}>No growers found</Text>
      ) : (
        <FlatList
          data={growers}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          renderItem={renderGrowerItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  growerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  growerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default GrowersScreen;