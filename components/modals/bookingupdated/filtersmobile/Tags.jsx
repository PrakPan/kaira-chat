import Image from "next/image";

export default function Tags(props) {
  const handleTags = (tag) => {
    if (props.selectedTags.includes(tag)) {
      props.setSelectedTags((prev) => prev.filter((item) => item !== tag));
    } else {
      props.setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const isSelectedTag = (tag) => {
    return props.selectedTags.includes(tag);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-medium">Tags</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        {props.tags.map((tag, index) => (
          <div
            key={index}
            onClick={() => handleTags(tag)}
            style={{
              background: isSelectedTag(tag) ? "#F0F0FE" : "#F6F6F6",
            }}
            className="border-2 p-2 rounded-full cursor-pointer flex items-center gap-1"
          >
            {tag?.name}
            {isSelectedTag(tag) && (
              <span>
                <Image src="/tick.svg" width={15} height={15} alt="tick" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
