export interface IBranchAPI {
  id: string
  name: string
}

export interface IBranch {
  id: string
  name: string
}

export function jsonToIBranchList(json: IBranchAPI[]): IBranch[] {

  return json.map(jsonToIBranch)
}

export function jsonToIBranch(json: IBranchAPI): IBranch {
  return {
    id: json.id,
    name: json.name,
  }
}