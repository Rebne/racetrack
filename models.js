class Driver {
    constructor(name, car) {
        this.name = name;
        this.car = car;
    }
}
class Race {
    constructor(id, drivers = []) {
        this.id = id;
        this.drivers = drivers;
        this.availableCars =
            [8, 7, 6, 5, 4, 3, 2, 1];
    }

    get getDrivers() {
        return this.drivers;
    }

    removeCar(car) {
        for (let i = 0; i < this.availableCars.length; i++) {
            if (this.availableCars[i] === car) {
                this.availableCars.splice(i, 1);
                break;
            }
        }
    }

    addDriver(name, car = null) {
        if (this.availableCars.length === 0) {
            return { error: true, code: 'capacity' };
        }
        
        if (!car) {
            car = this.availableCars.pop();
        } else if (car < 1 || car > 8) {
            return { error: true, code: 'overflow' };
        } else {
            this.removeCar(car);
        }
        if (!name) {
            return { error: true, code: 'empty' };
        }
        if (car < 1 || car > 8) {
        }

        const matchingDriver = this.drivers.filter((driver) => driver.name === name);
        if (matchingDriver.length > 0) {
            return { error: true, code: 'name' };
        }
        const matchingCar = this.drivers.filter((driver) => driver.car === car);
        if (matchingCar.length > 0) {
            return { error: true, code: 'car' };
        }

        const newDriver = new Driver(name, car);
        this.drivers.push(newDriver);

        return { error: false, code: null, car: car };
    }

    removeDriver(name) {
        const initialLength = this.drivers.length;
        const removedDriver = this.drivers.find(driver => driver.name === name);
        if (removedDriver) {
            this.availableCars.push(removedDriver.car);
            this.drivers = this.drivers.filter(driver => driver.name !== name);
        }
        return this.drivers.length !== initialLength;
    }
}
