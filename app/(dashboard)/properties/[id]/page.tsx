import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property {params.id}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Phase routing will be added here.
      </CardContent>
    </Card>
  );
}
