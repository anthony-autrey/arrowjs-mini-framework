export async function waitFor (milliseconds: number): Promise<Function> {
    return await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export async function waitForClearCallstack (): Promise<Function> {
    return await new Promise(resolve => setTimeout(resolve))
}
