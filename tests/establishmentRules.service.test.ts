import * as service from "../src/services/establishmentRules.service";
import * as repository from "../src/repositories/establishmentRules.repository";
import { EstablishmentRules } from "../src/models/establishmentRules.model";

jest.mock("../src/repositories/establishmentRules.repository");

describe("establishmentRules.service", () => {
  const rule: EstablishmentRules = {
    id: "rule-1",
    establishmentId: "estab-1",
    picturesLimit: 5,
    videoLimit: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma nova regra", async () => {
    (repository.create as jest.Mock).mockResolvedValue(undefined);

    await service.createRule(rule);

    expect(repository.create).toHaveBeenCalledWith(rule);
  });

  it("deve buscar regra por ID", async () => {
    (repository.findById as jest.Mock).mockResolvedValue(rule);

    const result = await service.getRuleById("rule-1");

    expect(repository.findById).toHaveBeenCalledWith("rule-1");
    expect(result).toEqual(rule);
  });

  it("deve buscar regra por establishmentId", async () => {
    (repository.findByEstablishmentId as jest.Mock).mockResolvedValue(rule);

    const result = await service.getRuleByEstablishmentId("estab-1");

    expect(repository.findByEstablishmentId).toHaveBeenCalledWith("estab-1");
    expect(result).toEqual(rule);
  });

  it("deve atualizar uma regra", async () => {
    const updates = { picturesLimit: 10 };

    (repository.update as jest.Mock).mockResolvedValue(undefined);

    await service.updateRule("rule-1", updates);

    expect(repository.update).toHaveBeenCalledWith("rule-1", updates);
  });

  it("deve deletar uma regra", async () => {
    (repository.remove as jest.Mock).mockResolvedValue(undefined);

    await service.deleteRule("rule-1");

    expect(repository.remove).toHaveBeenCalledWith("rule-1");
  });
});
