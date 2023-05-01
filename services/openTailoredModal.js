export default function openTailoredModal(router) {
    router.replace({
      query: { ...router.query, 'tailored-travel' : true},
    });
}

export function closeTailoredModal(router) {
    delete router.query.tailored
    router.push(router)

}