import "server-only";
import data from "../../public/data/ubigeo.json";

/** Ubigeo INEI: { d: departamentos, p: provincias, t: distritos } como pares [código, nombre] */
const dep = new Map(data.d as [string, string][]);
const prov = new Map(data.p as [string, string][]);
const dist = new Map(data.t as [string, string][]);

export function resolveUbigeo(code: string) {
  const district = dist.get(code);
  if (!district) return null;
  return {
    code,
    department: dep.get(code.slice(0, 2)) ?? "",
    province: prov.get(code.slice(0, 4)) ?? "",
    district,
  };
}
