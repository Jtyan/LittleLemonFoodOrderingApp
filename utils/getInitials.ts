 export const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    if (firstName) {
      const first = firstName[0];
      const second = firstName.length > 1 ? firstName[1] : first;
      return `${first}${second}`.toUpperCase();
    }

    if (lastName) {
      const first = lastName[0];
      const second = lastName.length > 1 ? lastName[1] : first;
      return `${first}${second}`.toUpperCase();
    }

    return "";
  };