import "./SkeletonLoader.css";

export default function SkeletonLoader({ count = 5 }) {
  return (
    <div className="SkeletonContainer">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="SkeletonRow">
          <div className="SkeletonPoint" />
          <div className="SkeletonText SkeletonName" />
          <div className="SkeletonText SkeletonCategory" />
          <div className="SkeletonText SkeletonPrice" />
          <div className="SkeletonActions">
            <div className="SkeletonButton" />
            <div className="SkeletonButton" />
            <div className="SkeletonButton" />
          </div>
        </div>
      ))}
    </div>
  );
}
