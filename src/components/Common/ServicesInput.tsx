import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

import { ServicesType } from "../Types/Types"

interface ServicesFormProps {
  services: ServicesType
  setServices: React.Dispatch<React.SetStateAction<ServicesType>>
  error: string
}

const ServicesInput: React.FC<ServicesFormProps> = ({
  services,
  setServices,
  error,
}) => {
  const handleAddInclusive = () => {
    setServices({ ...services, inclusives: [...services.inclusives, ""] })
  }

  const handleRemoveInclusive = (index: number) => {
    const updatedInclusives = services.inclusives.filter((_, i) => i !== index)
    setServices({ ...services, inclusives: updatedInclusives })
  }

  const handleUpdateInclusive = (index: number, value: string) => {
    const updatedInclusives = [...services.inclusives]
    updatedInclusives[index] = value
    setServices({ ...services, inclusives: updatedInclusives })
  }

  const handleAddExclusive = () => {
    setServices({ ...services, exclusives: [...services.exclusives, ""] })
  }

  const handleRemoveExclusive = (index: number) => {
    const updatedExclusives = services.exclusives.filter((_, i) => i !== index)
    setServices({ ...services, exclusives: updatedExclusives })
  }

  const handleUpdateExclusive = (index: number, value: string) => {
    const updatedExclusives = [...services.exclusives]
    updatedExclusives[index] = value
    setServices({ ...services, exclusives: updatedExclusives })
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 mt-5 text-primary">
        Services
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-4 border p-2 rounded-md border-primary">
        {/* Inclusives Section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 text-primary">Inclusive</h3>
          {services.inclusives.map((inclusive, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                type="text"
                placeholder="Add Inclusive Service"
                value={inclusive}
                required
                onChange={(e) => handleUpdateInclusive(index, e.target.value)}
                className="flex-grow"
              />
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => handleRemoveInclusive(index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddInclusive}
            className="mt-2 text-white"
          >
            Add New Inclusive
          </Button>
        </div>

        {/* Exclusives Section */}
        <div>
          <h3 className="text-lg font-medium mb-2 text-primary">Exclusive</h3>
          {services.exclusives.map((exclusive, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                type="text"
                placeholder="Add Exclusive Service"
                value={exclusive}
                required
                onChange={(e) => handleUpdateExclusive(index, e.target.value)}
                className="flex-grow"
              />
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => handleRemoveExclusive(index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddExclusive}
            className="mt-2 text-white"
          >
            Add New Exclusive
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ServicesInput
