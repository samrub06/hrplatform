import ContactProfile from "./contact-profile"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ContactProfile id={id} />
}
