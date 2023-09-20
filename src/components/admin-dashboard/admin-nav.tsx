import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface AdminNavProps {
    data: DataAdjustments[],
    indexNames: string[],
    functions: any
}

export default function AdminNav ({data, indexNames, functions}: AdminNavProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center w-full">
        {indexNames.map((index) => {
          return (
            <div key={index}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-48 capitalize">
                    {index.split('-').join(' ')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {data.map((el) => {
                    if (el.index === index) {
                      return (
                        <DropdownMenuItem
                          key={el.date.toISOString()}
                          className="w-full flex justify-center"
                          onClick={() => functions.selectAdj(el)}
                        >
                          {el.date.toISOString().slice(0, 10)}
                        </DropdownMenuItem>
                      );
                    }
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-48">
              New Adjustment
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {indexNames.map((el) => {
                return (
                  <DropdownMenuItem
                    key={el}
                    className="w-full"
                    onClick={() => functions.createAdjustment(el)}
                  >
                    {el}
                  </DropdownMenuItem>
                );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
}