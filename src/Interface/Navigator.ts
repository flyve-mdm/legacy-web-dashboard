export interface Navigator {
    credentials?: CredentialContainer    
}

interface CredentialContainer {
    get(options?: {
        password?: boolean,
        unmediated?: boolean,
        federated?: {
            providers?: string[],
            protocols?: string[]
        }
    }): Promise<Credential>
    store(credential: Credential): Promise<Credential>
    requireUserMediation(): Promise<void>
}

export interface Credential {
    readonly iconURL?: string
    readonly name?: string
    readonly id: string
    readonly password: string
    readonly type: 'password' | 'federated'
}