import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import styled from 'styled-components'

const Container = styled.div`
    element-selector {
        /* CSS for the wrapper element */
    }
    element-selector[data-disabled] {
        /* CSS for disabled range slider element */
    }

    .range-slider__range {
        /* CSS for range */
        background: #000;
    }

    .range-slider__range[data-active] {
        /* CSS for active (actively being dragged) range */
        background: #000;
    }

    .range-slider__thumb {
        /* CSS for thumbs */
        background: #fff;
        border: 9px solid #000;
    }

    .range-slider__thumb[data-lower] {
        /* CSS for lower thumb */
    }

    .range-slider__thumb[data-upper] {
        /* CSS for upper thumb */
    }

    .range-slider__thumb[data-active] {
        /* CSS for active (actively being dragged) thumbs */
    }

    .range-slider__thumb[data-disabled] {
        /* CSS for disabled thumbs */
    }
`

export default function RangeSliderInput(props) {

    return (
        <Container>
            <RangeSlider
                min={0}
                max={10000}
                step={1}
                defaultValue={props.defaultValue}
                value={props.value}
                onInput={props.onChange}
                className={"text-black"}
            />
        </Container>
    );
}
