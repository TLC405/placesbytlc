import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface ComparisonSliderProps {
  originalImage: string;
  cartoonImage: string;
}

export function ComparisonSlider({ originalImage, cartoonImage }: ComparisonSliderProps) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-primary shadow-xl">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={originalImage} alt="Original" />}
        itemTwo={<ReactCompareSliderImage src={cartoonImage} alt="Cartoon" />}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
