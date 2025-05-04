// import { powersync, setupPowerSync } from "@/powersync/system";
// import { useEffect, useState } from 'react';
// import { Text, View } from 'react-native';



// export default function HomeScreen() {

//   const [hrEmployee, setHrEmployee] = useState([]);
//   const [error, setError] = useState([]);

//         useEffect(() => {
//         setupPowerSync();
//       }, []);

//   useEffect(() => {
//     console.log('hrEmployee', hrEmployee)
//     // .get returns the first item of the result. Throws an exception if no result is found.
//     powersync.get('SELECT * from hr_employee WHERE id = ?', [3])
//       .then(setHrEmployee)
//       .catch(ex => setError(ex.message))
//       console.log(hrEmployee)
// }, []);

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text style={{color: 'blue'}}>{error || hrEmployee}</Text>

//       <Text style={{color: 'red'}}>Hello</Text>
//     </View>
//   );
// }




import { powersync } from "@/powersync/system";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [hrEmployee, setHrEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Create an abort controller to properly clean up
    const controller = new AbortController();
    
    console.log('Setting up employee data watcher...');
    
    // Option 1: Use with callback (easier)
    powersync.watch(
      'SELECT * from hr_employee WHERE id = ?', 
      [3], 
      { 
        onResult: (result) => {
          console.log('Employee data updated:', result);
          // Extract the actual employee object from the rows array
          if (result.rows?._array?.length > 0) {
            setHrEmployee(result.rows._array[0]);
          } else {
            setError('No employee found with ID 3');
          }
        },
        onError: (error) => {
          console.error('Watch error:', error);
          setError(error.message);
        }
      },
      { signal: controller.signal }
    );
  
    // Clean up the watch query when component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  // Function to render employee details in a readable format
  const renderEmployeeDetails = () => {
    if (!hrEmployee) return null;

    return (
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.name}>{hrEmployee.name}</Text>
        <Text style={styles.jobTitle}>{hrEmployee.job_title}</Text>
        
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text>Email: {hrEmployee.work_email || 'N/A'}</Text>
        <Text>Phone: {hrEmployee.work_phone || 'N/A'}</Text>
        <Text>Mobile: {hrEmployee.mobile_phone || 'N/A'}</Text>
        
        <Text style={styles.sectionTitle}>Employment Details</Text>
        <Text>Department ID: {hrEmployee.department_id}</Text>
        <Text>Job ID: {hrEmployee.job_id}</Text>
        <Text>Status: {hrEmployee.active ? 'Active' : 'Inactive'}</Text>
        <Text>Employee Type: {hrEmployee.employee_type}</Text>
        
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text>Created: {hrEmployee.create_date}</Text>
        <Text>Last Updated: {hrEmployee.write_date}</Text>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hrEmployee ? (
        renderEmployeeDetails()
      ) : (
        <Text style={styles.loading}>Loading employee data...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  jobTitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333'
  },
  error: {
    color: 'red',
    fontSize: 16
  },
  loading: {
    color: '#888',
    fontSize: 16
  }
});