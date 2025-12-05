import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertiesPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Properties</CardTitle>
        <Button size="sm">New property</Button>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Property list coming soon.
      </CardContent>
    </Card>
  );
}
