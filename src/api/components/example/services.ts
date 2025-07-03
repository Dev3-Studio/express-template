

export async function getExample(userId: string) {
    return await new Promise((resolve => {
        setTimeout(() => {
            resolve({
                userId,
            });
        }, 1000);
    }))
}
