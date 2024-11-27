import axios from "axios";

interface IProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: object;
  payload?: object;
}

export const domain = "https://api.integrationos.com/v1";
export const devDomain = "https://development-api.integrationos.com/v1";

export const keys = {
    "list.connections": "connections.list",
    "get.subscription": "subscription.get",
    "get.product": "product.get",
    "list.payment.methods": "payment.methods.list",
    "list.invoices": "invoices.list",
  }

export const api = async ({ method, url, headers, payload }: IProps) => {

  const { data } = await axios({
    method,
    url,
    headers,
    data: payload,
  });

    return data;

};
