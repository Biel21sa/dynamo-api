import { createEstablishment } from "../src/services/establishment.service";
import * as userService from "../src/services/user.service";
import * as repo from "../src/repositories/establishment.repository";
import { Establishment } from "../src/models/establishment.model";

// Mocks automáticos
jest.mock("../src/services/user.service");
jest.mock("../src/repositories/establishment.repository");

describe("createEstablishment", () => {
  const mockUserOwner = {
    id: "user-123",
    name: "John Owner",
    email: "john@example.com",
    type: "owner",
  };

  const mockUserCustomer = {
    id: "user-456",
    name: "Jane Customer",
    email: "jane@example.com",
    type: "customer",
  };

  const data = {
    name: "My Store",
    ownerId: mockUserOwner.id,
    type: "shopping" as const,
  };

  it("deve criar estabelecimento se o usuário for do tipo 'owner'", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUserOwner);
    (repo.createEstablishment as jest.Mock).mockResolvedValue(undefined);

    const result = await createEstablishment(data);

    expect(result).toHaveProperty("id");
    expect(result.name).toBe(data.name);
    expect(result.ownerId).toBe(data.ownerId);
    expect(result.type).toBe(data.type);
    expect(repo.createEstablishment).toHaveBeenCalledWith(
      expect.objectContaining(data)
    );
  });

  it("deve lançar erro se o usuário não for encontrado", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    await expect(createEstablishment(data)).rejects.toThrow("Owner not found");
  });

  it("deve lançar erro se o usuário não for do tipo 'owner'", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUserCustomer);

    await expect(createEstablishment(data)).rejects.toThrow(
      "Only users of type 'owner' can create an establishment"
    );
  });
});
describe("getById", () => {
  it("deve chamar o repositório com o ID correto", async () => {
    const id = "establishment-123";
    const mockEstablishment = { id, name: "My Store" } as Establishment;

    (repo.getEstablishmentById as jest.Mock).mockResolvedValue(
      mockEstablishment
    );

    const result = await repo.getEstablishmentById(id);

    expect(repo.getEstablishmentById).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockEstablishment);
  });
});
