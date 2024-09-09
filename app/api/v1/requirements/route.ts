//Do endpoint to create a requirement in next js

import {NextApiRequest, NextApiResponse} from 'next'
import {createRequirementAction} from '@/app/actions/actions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // const formData = new FormData()
        // formData.append('description', req.body.description)
        // formData.append('priority', req.body.priority)
        // formData.append('details', JSON.stringify(req.body.details))
        // const { id, error } = await createRequirementAction(formData)
        // if (error) {
        //     res.status(500).json({ error })
        // } else {
        //     res.status(201).json({ id })
        // }
        res.status(201).json({id: '123'})
    } else {
        res.status(405).json({error: 'Method Not Allowed'})
    }
}
