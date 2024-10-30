import UiDropdown from "../../../UiDropdown";


export default function PropertyType(props) {
    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-semibold">Property type</div>
            <div className="w-[12rem]">
                <UiDropdown
                    options={props.types}
                    onSelect={props.handleSelectOption}
                ></UiDropdown>
            </div>
        </div>
    )
}
