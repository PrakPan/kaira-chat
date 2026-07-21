// Parks a DOM node on a coordinate, in the map pane that receives mouse events.
//
// The map's markers are HTML rather than `google.maps.Marker` icons because they
// show the place's own photo, and a marker icon cannot pull in an external image
// (see components/ElementMarker). A city's pin then has to be HTML too, or the
// two would land in different panes — whose order is fixed, and would bury the
// pins under the photos clustered around them (see components/CityPinMarker).
//
// The node itself decides how it sits on its point: this only writes `left` /
// `top`, so a caller that wants a disc centred on the point or a pin hanging
// from its tip says so with its own transform.

export interface HtmlMarkerOverlay {
  setPosition(next: google.maps.LatLngLiteral): void;
  setMap(map: google.maps.Map | null): void;
}

type OverlayCtor = new (
  position: google.maps.LatLngLiteral,
  container: HTMLElement,
) => HtmlMarkerOverlay;

let cached: OverlayCtor | null = null;

// Built on first use, not at module load: the class extends
// google.maps.OverlayView, which does not exist until the Maps script has run.
const overlayClass = (): OverlayCtor => {
  if (cached) return cached;

  class MarkerOverlay extends google.maps.OverlayView {
    constructor(
      private position: google.maps.LatLngLiteral,
      private readonly container: HTMLElement,
    ) {
      super();
    }

    setPosition(next: google.maps.LatLngLiteral) {
      if (next.lat === this.position.lat && next.lng === this.position.lng)
        return;
      this.position = next;
      this.draw();
    }

    onAdd() {
      this.getPanes()?.overlayMouseTarget.appendChild(this.container);
    }

    draw() {
      const point = this.getProjection()?.fromLatLngToDivPixel(
        new google.maps.LatLng(this.position.lat, this.position.lng),
      );
      if (!point) return;
      this.container.style.left = `${point.x}px`;
      this.container.style.top = `${point.y}px`;
    }

    onRemove() {
      this.container.remove();
    }
  }

  cached = MarkerOverlay as unknown as OverlayCtor;
  return cached;
};

export const createHtmlMarker = (
  position: google.maps.LatLngLiteral,
  container: HTMLElement,
): HtmlMarkerOverlay => new (overlayClass())(position, container);
