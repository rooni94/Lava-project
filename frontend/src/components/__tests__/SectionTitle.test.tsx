import { render, screen } from "@testing-library/react";
import SectionTitle from "../ui/SectionTitle";

describe("SectionTitle", () => {
  it("renders title and subtitle", () => {
    render(<SectionTitle title="Headline" subtitle="Short description" />);
    expect(screen.getByText("Headline")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
  });
});
