import axios from 'axios';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const fetchAddressByCep = async (cep: string): Promise<Pick<ViaCepResponse, 'logradouro' | 'bairro' | 'localidade' | 'uf'> | null> => {
  const cleanedCep = cep.replace(/\D/g, '');

  if (cleanedCep.length !== 8) {
    return null;
  }

  try {
    const { data } = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanedCep}/json/`);

    if (data.erro) return null;

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    };
  } catch (error) {
    return null;
  }
};