async function createDriverInDB(driver_data) {
    try {
        const response = await fetch('/drivers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driver_data)
        });
        
        if (!response.ok) {
            const errorData =  await response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch create driver error:', error);
    }
}

async function createRaceInDB(race_id) {
    try {
        const response = await fetch('/races', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: race_id})
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch create race error', error);
    }
}

async function getRacesInDB() {
    try {
        const response = await fetch('/races', {
            method: 'GET'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
        const data = response.json();
        return data;

    } catch (error) {
        console.error('Fetch get races error', error);
    }
}

async function getDriversInDB(race_id) {
    try {
        const response = await fetch(`/drivers/${race_id}`, {
            method: 'GET'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch get drivers error', error);
    }
}

async function updateDriverInDB(driver_data) {
    try {
        const response = await fetch('/drivers', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driver_data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch update driver error', error);
    }
}

async function deleteDriverInDB(driver_name) {
    try {
        const response = await fetch('/drivers', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: driver_name})
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch delete driver error', error);
    }
}

async function deleteRaceInDB(race_id) {
    try {
        const response = await fetch('/races', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: race_id})
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch delete race error', error);
    }
}