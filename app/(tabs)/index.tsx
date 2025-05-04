import { powersync } from "@/powersync/system";
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';



export default function HomeScreen() {

  const [hrEmployee, setHrEmployee] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    // .get returns the first item of the result. Throws an exception if no result is found.
    powersync.get('SELECT * from todos WHERE id = ?', [1])
      .then(setHrEmployee)
      .catch(ex => setError(ex.message))
      console.log(hrEmployee)
}, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'blue'}}>{error || hrEmployee.name}</Text>

      <Text style={{color: 'red'}}>Hello</Text>
    </View>
  );
}

