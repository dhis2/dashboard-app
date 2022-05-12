export const THEMATIC_LAYER = 'thematic'

const getThematicMapViews = (map) =>
    map.mapViews && map.mapViews.find((mv) => mv.layer.includes(THEMATIC_LAYER))

export default getThematicMapViews
