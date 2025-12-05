import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPropertyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a new property</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Property creation form will live here.
      </CardContent>
    </Card>
  );
}
