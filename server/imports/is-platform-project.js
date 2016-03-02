export default function isPlatformProject (repo) {
  return repo.description && repo.description.indexOf('[THE_PLATFORM]') > -1
}
