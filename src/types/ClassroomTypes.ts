import z from "zod";

export const classroomTypesSchema = z.object({
  id: z.number(),
  name: z.string().min(5).optional(),
  accessLevel: z.string().min(5).optional(),
  description: z.string().optional()
});

export type ClassroomTypes = z.infer<typeof classroomTypesSchema>;

export const classroomTypeList: ClassroomTypes[] =
  [{ id: 1, name: "Class Room", accessLevel: "All the kids in classroom", description: "d1" },
  { id: 2, name: "Families", accessLevel: "All the wards in the single family", description: "d1" }
    , { id: 3, name: "Tutor", accessLevel: "All the students for one tutor", description: "d1" }
    , { id: 4, name: "Scociety", accessLevel: "All the students for one Scociety" }
    , { id: 5, name: "Two families - Shared plan", accessLevel: "All the students for two families. Shared plan" }
    , { id: 5, name: "Two families - Shared plan", accessLevel: "All the students for two families. Shared plan" }
    , { id: 5, name: "Two families - Shared plan", accessLevel: "All the students for two families. Shared plan" }
    , { id: 5, name: "Two families - Shared plan", accessLevel: "All the students for two families. Shared plan" }
    , {
    id: 5, name: "Two families - Shared plan", accessLevel: "All the students for two families. Shared plan All the students for two families. Shared plan"

  }];

// classroomDescriptions.ts
export const classroomDescriptions: Record<number, string> = {
  1: `This classroom is designed for collaborative learning.
      Students can work in groups, share resources, and engage in interactive discussions.`,
  2: `Families classroom brings together wards of a single family
      for shared learning and bonding. 
      - Encourages collaboration between siblings.\n
- Builds a culture of shared responsibility and motivation.\n
`,
  3: `Tutor classroom allows one tutor to manage all their students
      with personalized attention.`,
  4: `Society classroom connects students across a society
      for community-driven education.`,
  5: `Shared plan classroom enables two families to collaborate
      and share resources effectively.`,
};
