import bcrypt from "bcryptjs"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  passwordHash: string
  createdAt: string
}

// Simula um banco de dados em memória (em produção, usar DB real)
const users: User[] = []

// Função para criar usuário de teste (apenas para desenvolvimento)
async function createTestUser() {
  const testUser = {
    id: "user-test-001",
    name: "Usuário Teste",
    email: "teste@teste.com",
    phone: "(11) 99999-9999",
    cpf: "000.000.000-00",
    passwordHash: await bcrypt.hash("123456", 10),
    createdAt: new Date().toISOString(),
  }

  // Só adiciona se não existir
  if (!users.find(u => u.email === testUser.email)) {
    users.push(testUser)
  }
}

// Criar usuário de teste ao carregar o módulo
createTestUser()

export async function createUser(data: {
  name: string
  email: string
  phone: string
  cpf: string
  password: string
}): Promise<{ success: boolean; error?: string; user?: User }> {
  // Verificar se email já existe
  const existingUser = users.find((u) => u.email === data.email)
  if (existingUser) {
    return { success: false, error: "Email já cadastrado" }
  }

  // Verificar se CPF já existe
  const existingCpf = users.find((u) => u.cpf === data.cpf)
  if (existingCpf) {
    return { success: false, error: "CPF já cadastrado" }
  }

  // Hash da senha
  const passwordHash = await bcrypt.hash(data.password, 10)

  // Criar usuário
  const user: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    cpf: data.cpf,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  users.push(user)

  return { success: true, user }
}

export async function validateUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: Omit<User, "passwordHash"> }> {
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false }
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return { success: false }
  }

  // Retornar usuário sem o hash da senha
  const { passwordHash, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

export function getUserByEmail(email: string): Omit<User, "passwordHash"> | null {
  const user = users.find((u) => u.email === email)
  if (!user) return null

  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}

export function updateUserByEmail(
  email: string,
  updates: Partial<Pick<User, "name" | "phone">>,
): Omit<User, "passwordHash"> | null {
  const user = users.find((u) => u.email === email)
  if (!user) return null
  if (typeof updates.name === "string") user.name = updates.name
  if (typeof updates.phone === "string") user.phone = updates.phone
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}
