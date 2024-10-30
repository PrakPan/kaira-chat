export default function Tags(props) {

    const handleTags = (tag) => {
        if (props.selectedTags.includes(tag)) {
            props.setSelectedTags(prev => prev.filter(item => item !== tag));
        } else {
            props.setSelectedTags(prev => [...prev, tag])
        }
    }

    const isSelectedTag = (tag) => {
        return props.selectedTags.includes(tag);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-semibold">Tags</div>

            <div className="flex flex-row items-center gap-2 flex-wrap">
                {props.tags.map((tag, index) => (
                    <div
                        key={index}
                        onClick={() => handleTags(tag)}
                        style={{ background: isSelectedTag(tag) ? "black" : "", color: isSelectedTag(tag) ? "white" : "" }}
                        className="border-2 border-black p-2 rounded-lg cursor-pointer">{tag}</div>
                ))}
            </div>
        </div>
    )
}
