import { powersync, setupPowerSync } from "@/powersync/system";
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Tab2Screen() {
  const [hrEmployee, setHrEmployee] = useState([]);
  const [error, setError] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);

  // Initialize PowerSync
  useEffect(() => {
    setupPowerSync();
    
    // Monitor sync status
    return powersync.registerListener({
      statusChanged: (status) => {
        setSyncStatus(status);
        console.log('PowerSync status:', status);
      }
    });
  }, []);

  // After PowerSync is initialized, check for data
  useEffect(() => {
    // First check if ANY employees exist
    powersync.getAll('SELECT * FROM hr_employee LIMIT 1')
      .then(results => {
        console.log('Employee check:', results);
        if (results.length === 0) {
          setError('No employees found in database');
        } else {
          // Then try to get the specific employee
          powersync.getOptional('SELECT * from hr_employee WHERE id = ?', [3])
            .then(result => {
              if (result) {
                setHrEmployee(result);
              } else {
                setError('Employee with ID 3 not found');
              }
            })
            .catch(ex => setError(ex.message));
        }
      })
      .catch(ex => {
        console.error('Error checking employees:', ex);
        setError(ex.message);
      });
  }, [syncStatus?.hasSynced]); // Re-run when sync completes

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'blue'}}>{error || hrEmployee.name}</Text>
      <Text style={{color: 'green'}}>
        Sync Status: {syncStatus?.connected ? 'Connected' : 'Disconnected'}, 
        {syncStatus?.hasSynced ? ' Data Synced' : ' Waiting for sync'}
      </Text>
      <Text style={{color: 'red'}}>Hello</Text>
    </View>
  );
}