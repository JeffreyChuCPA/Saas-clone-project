import { Button } from "@/components/ui/button";

export default function HomePage() {
  return <div>
    <Button variant="default" size="default">Default Button</Button>
    <br></br>
      <Button variant="destructive" size="sm">Destructive Small Button</Button>
      <br></br>
      <Button variant="outline" size="lg">Outline Large Button</Button>
      <br></br>
      <Button variant="secondary" size="icon">Secondary Icon Button</Button>
      <br></br>
      <Button variant="ghost">Ghost Button</Button>
      <br></br>
      <Button variant="link">Link Button</Button>
  </div>
}