import express from "express";
import {and, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {departements, subjects} from "../schema";
import {db} from "../db";


const router = express.Router();
//Get all subjects with optional search ,filtering, pagination
router.get("/", async (req ,res) => {
    try {

        const { search,department ,page=1,limit=10} = req.query;

        const currentPage = Math.max(1,+page);
        const limitPerPage = Math.max(1,+limit);
        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        //if search query exists , filter subject by name or subject code

        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name,`%${search}%`),
                    ilike(subjects.code,`%${search}%`),
                )
            );
        }
        if(department){
            filterConditions.push(
                ilike(departements.name,`%${department}%`),
            )
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({count : sql<number>`count(*)`})
            .from(subjects)
            .leftJoin(departements,eq(subjects.departementId,departements.id))
            .where(whereClause)

        const totalCount = countResult[0]?.count ?? 0 ;

        const subjectList = await db.select({...getTableColumns(subjects),
        departement : {...getTableColumns(departements)}
        }).from(subjects).leftJoin(departements,eq(subjects.departementId,departements.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset)

        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages : Math.ceil(totalCount / limitPerPage),


            }
        })


    }catch(err){
        console.error( `Get /subjects error ${err.message}` );
        res.status(500).json({error: 'failed to get subjects'});
    }
})

export default router;