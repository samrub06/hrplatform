import ContactProfile from "./contact-profile"

export default function Page({ params }: { params: { id: string } }) {
  return <ContactProfile id={params.id} />
}
