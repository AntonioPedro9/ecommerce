export const formatAddress = (address: {
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}) => {
  const complementString = address.complement ? `, ${address.complement}` : "";

  return `${address.street}, ${address.number}${complementString}, ${address.neighborhood}, ${address.city} - ${address.state} • CEP: ${address.zipCode}`;
};
