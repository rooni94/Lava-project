import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function RichEditor({ value, onChange, placeholder }: Props) {
  return <ReactQuill theme="snow" value={value} onChange={onChange} placeholder={placeholder} />;
}
