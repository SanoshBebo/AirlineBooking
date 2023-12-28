export const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return dateTime.toLocaleString(undefined, options);
  };


  export const calculateArrivalDateTime = (departureDateTime, duration) => {
    const departureTime = new Date(departureDateTime); // Convert departure datetime string to a Date object
    const durationParts = duration.split(':'); // Split flight duration string
    const hours = parseInt(durationParts[0]); // Get hours from flight duration
    const minutes = parseInt(durationParts[1]); // Get minutes from flight duration
    const seconds = parseInt(durationParts[2]); // Get seconds from flight duration

    // Calculate arrival datetime by adding flight duration to the departure datetime
    const arrivalDateTime = new Date(departureTime.getTime() + hours * 3600000 + minutes * 60000 + seconds * 1000);

    return arrivalDateTime.toLocaleString(); // Format arrival date and time
  };

