async function createDriver(driver_data) {
    try {
        const response = await fetch('/drivers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driver_data)
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch create driver error:', error);
    }
}

async function createRace(race_id) {
    try {
        const response = await fetch('/races', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: race_id})
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch create race error', error);
    }
}

async function getRace(race_id) {
    try {
        const response = await fetch('/races', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: race_id})
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch create race error', error);
    }
}
async function deleteRace(race_id) {
    try {
        const response = await fetch('/races', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: race_id})
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch get race error', error);
    }
}

async function updateDriver(driver_data) {
    try {
        const response = await fetch('/drivers', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driver_data)
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch update driver error', error);
    }
}

async function deleteDriver(driver_name) {
    try {
        const response = await fetch('/drivers', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driver_name)
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch delete driver error', error);
    }
}

async function deleteRace(race_id) {
    try {
        const response = await fetch('/races', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: race_id})
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error);
        }
    } catch (error) {
        console.error('Fetch delete race error', error);
    }
}