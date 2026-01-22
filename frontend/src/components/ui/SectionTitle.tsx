type Props = {
  title: string;
  subtitle?: string;
  titleStyle?: React.CSSProperties;
};

export default function SectionTitle({ title, subtitle, titleStyle }: Props) {
  return (
    <div className="text-center space-y-2 mb-8">
      <h2 className="text-3xl font-bold text-secondary dark:text-neutral-50" style={titleStyle}>
        {title}
      </h2>
      {subtitle && <p className="text-accent dark:text-neutral-400">{subtitle}</p>}
      <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
    </div>
  );
}
