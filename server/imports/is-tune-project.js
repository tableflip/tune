// This function is given a repo object from the Github API and should return a
// boolean indicating whether it represents a relevant project.
// See [Github API](https://developer.github.com/v3/repos/#get)
export default function isTuneProject (repo) {
  return repo.description && repo.description.indexOf(':robot:') > -1
}
