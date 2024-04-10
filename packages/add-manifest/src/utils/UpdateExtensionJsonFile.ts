export const updateExtensionJsonFile = ({
  fileContent,
  extensions
}: {
  fileContent: {
    recommendations: string[]
  }
  extensions: string[]
}): string => {
  extensions.forEach((recommendation) => {
    if (!fileContent.recommendations.includes(recommendation)) {
      fileContent.recommendations.push(recommendation)
    }
  })

  return JSON.stringify(fileContent, null, 2)
}