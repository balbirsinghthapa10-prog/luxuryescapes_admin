import React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FAQType } from "../Types/Types"

interface FAQProps {
  faqs: FAQType[]
  setFaqs: React.Dispatch<React.SetStateAction<FAQType[]>>
}

const FAQInput: React.FC<FAQProps> = ({ faqs, setFaqs }) => {
  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const handleUpdateFAQ = (
    index: number,
    key: "question" | "answer",
    value: string
  ) => {
    const updatedFaqs = [...faqs]
    updatedFaqs[index][key] = value
    setFaqs(updatedFaqs)
  }

  const handleRemoveFAQ = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index)
    setFaqs(updatedFaqs)
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 mt-5 text-primary">FAQs</h2>
      {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}

      {faqs.map((faq, index) => (
        <div
          key={index}
          className="mb-4 border p-2 rounded-md border-primary pb-4"
        >
          <h2 className="text-lg font-bold mb-2">FAQ {index + 1}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm italic text-gray-400">Question:</label>
              <Input
                type="text"
                placeholder="Question"
                value={faq.question}
                required
                onChange={(e) =>
                  handleUpdateFAQ(index, "question", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-sm italic text-gray-400">Answer:</label>
              <Input
                type="text"
                placeholder="Answer"
                value={faq.answer}
                required
                onChange={(e) =>
                  handleUpdateFAQ(index, "answer", e.target.value)
                }
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={() => handleRemoveFAQ(index)}
            variant={"destructive"}
            className="mt-4"
          >
            <Trash2 size={18} className="mr-2" />
            Remove Question
          </Button>
        </div>
      ))}

      <Button type="button" onClick={handleAddFAQ} className="mt-2 text-white">
        Add New FAQ
      </Button>
    </div>
  )
}

export default FAQInput
